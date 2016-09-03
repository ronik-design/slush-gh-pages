import test from 'ava';
import path from 'path';
import del from 'del';
import answers from './fixtures/answers.json'; // eslint-disable-line
import handleAnswers from '../tasks/handle-answers'; // eslint-disable-line

const TMP_DIR = path.resolve(__dirname, '.tmp');
const SRC_DIR = path.join(__dirname, '../templates');
const DEFAULTS = {};

test('templates install and installed files pass tests', async t => {
  try {
    await handleAnswers({
      answers,
      defaults: DEFAULTS,
      srcDir: SRC_DIR,
      cwd: TMP_DIR
    });
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  await del(TMP_DIR);
});
