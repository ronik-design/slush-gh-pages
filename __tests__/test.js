import test from 'ava';
import path from 'path';
import del from 'del';
import answers from './fixtures/answers.json'; // eslint-disable-line
import installTheme from '../tasks/install-theme'; // eslint-disable-line

const BUILD_DIR = path.resolve(__dirname, 'build');
const THEMES_DIR = path.resolve(__dirname, '..', 'themes');
const THEMES_TMP_DIR = path.resolve(__dirname, 'build', '.theme-tmp');

test('templates install and installed files pass tests', async t => {
  try {
    await installTheme({
      answers,
      themesDir: THEMES_DIR,
      themesTmpDir: THEMES_TMP_DIR,
      cwd: BUILD_DIR
    });
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  await del(BUILD_DIR);
});
