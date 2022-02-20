async function getBody(stream, json = true) {
  const chunks = [];
  for await (const chunk of stream) chunks.push(chunk);
  const str = Buffer.concat(chunks).toString();
  if (json) return JSON.parse(str);
  return str;
}

module.exports = { getBody };