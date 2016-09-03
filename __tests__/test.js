import test from 'ava';
import gulp from 'gulp';
import path from 'path';
import del from 'del';
import answers from './fixtures/answers.json';
import handleAnswers from '../tasks/handle-answers';

const TMP_DIR = path.resolve(__dirname, '.tmp');
const SRC_DIR = path.join(__dirname, '../templates');
const DEFAULTS = {};

test('templates install and installed files pass tests', async t => {
  try {
    await handleAnswers({
      answers,
      defaults: DEFAULTS,
      gulp,
      srcDir: SRC_DIR,
      cwd: TMP_DIR
    });
    t.pass();
  } catch (e) {
    t.fail(e.message);
  }
  await del(TMP_DIR);
});
