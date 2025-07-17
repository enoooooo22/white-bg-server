import formidable from 'formidable';
import fs from 'fs';
import fetch from 'node-fetch';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = formidable({});
  form.parse(req, async (err, fields, files) => {
    if (err) {
      res.status(500).send('Error parsing file: ' + err.message);
      return;
    }

    try {
      const file = files.image?.[0];
      if (!file) {
        res.status(400).send('No image file uploaded');
        return;
      }

      const formData = new FormData();
      formData.append('image_file', fs.createReadStream(file.filepath), file.originalFilename);
      formData.append('bg_color', 'ffffff');

      const r = await fetch('https://api.remove.bg/v1.0/removebg', {
        method: 'POST',
        headers: { 'X-Api-Key': 'hrFFUWW8JQBgfXpKrkmvNALo' },
        body: formData,
      });

      if (!r.ok) {
        const errorText = await r.text();
        res.status(r.status).send(errorText);
        return;
      }

      const result = await r.arrayBuffer();
      res.setHeader('Content-Type', 'image/png');
      res.send(Buffer.from(result));
    } catch (e) {
      res.status(500).send('Unexpected error: ' + e.message);
    }
  });
}
