import test from 'ava';
import path from 'path';
import del from 'del';
import answers from './fixtures/answers.json'; // eslint-disable-line
import installTheme from '../tasks/install-theme'; // eslint-disable-line

const TMP_DIR = path.resolve(__dirname, '.tmp');
const DEFAULTS = {};

test('templates install and installed files pass tests', async t => {
  try {
    await installTheme({
      answers,
      defaults: DEFAULTS,
      templatesDir: path.resolve(__dirname, '..', 'templates'),
      cwd: TMP_DIR
    });
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  await del(TMP_DIR);
});
