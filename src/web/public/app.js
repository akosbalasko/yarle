const filesInput = document.getElementById('files');
const formatSelect = document.getElementById('format');
const convertButton = document.getElementById('convert');
const statusNode = document.getElementById('status');

const fileToBase64 = async (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result || '';
      const [, base64 = ''] = String(result).split(',');
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const saveBlob = async (blob) => {
  if ('showSaveFilePicker' in window) {
    const handle = await window.showSaveFilePicker({
      suggestedName: 'yarle-export.zip',
      types: [
        {
          description: 'ZIP archive',
          accept: { 'application/zip': ['.zip'] },
        },
      ],
    });
    const writable = await handle.createWritable();
    await writable.write(blob);
    await writable.close();
    return;
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'yarle-export.zip';
  a.click();
  URL.revokeObjectURL(url);
};

convertButton.addEventListener('click', async () => {
  const files = Array.from(filesInput.files || []);
  if (!files.length) {
    statusNode.textContent = 'Choose at least one .enex file.';
    return;
  }

  convertButton.disabled = true;
  statusNode.textContent = 'Uploading files and converting…';

  try {
    const preparedFiles = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        contentBase64: await fileToBase64(file),
      })),
    );

    const response = await fetch('/api/convert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        files: preparedFiles,
        outputFormat: formatSelect.value,
      }),
    });

    if (!response.ok) {
      const payload = await response.json().catch(() => ({}));
      throw new Error(payload.error || 'Conversion failed');
    }

    const blob = await response.blob();
    await saveBlob(blob);
    statusNode.textContent = 'Done. Your archive has been downloaded.';
  } catch (error) {
    statusNode.textContent = error instanceof Error ? error.message : 'Conversion failed';
  } finally {
    convertButton.disabled = false;
  }
});
