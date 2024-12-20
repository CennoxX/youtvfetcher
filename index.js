import "jsr:@std/dotenv/load";
import YouTv from './YouTv.js';

console.clear();
const downloadPath = Deno.args[0] || '.';

const downloadRecording = async (recording, path) => {
  const stream = await recording.download();
  const file = await Deno.open(path, { write: true, create: true });
  await stream.pipeTo(file.writable);
};

try {
  const youtv = new YouTv();
  const { YOUTV_USERNAME, YOUTV_PASSWORD } = Deno.env.toObject();
  await youtv.login(YOUTV_USERNAME, YOUTV_PASSWORD);
  const recordings = await youtv.fetchRecordings();

  for (const recording of recordings.filter((r) => r.isRecorded())) {
    const filename = recording.filename();
    const path = `${downloadPath}/${filename}.mp4`;
    try {
      const fileInfo = await Deno.stat(path);
      if (fileInfo.isFile) {
        const size = await recording.getSize();
        if (size <= fileInfo.size) {
          console.log(`Already downloaded. Skipping "${filename}"`);
          continue;
        }
        await Deno.remove(path);
      }
    } catch (error) {
      console.error(error);
    }

    console.log(`Downloading "${filename}" …`);
    await downloadRecording(recording, path);
    console.log(`Finished downloading "${filename}"`);
  }
  console.log('finished');
} catch (error) {
  console.error('Error:', error);
  Deno.exit(1);
}
