let isUploading = false;
let uploadedChunks = [];
let fileName = ''
const startButton = document.getElementById('startButton')
const pauseButton = document.getElementById('pauseButton')
const resumeButton = document.getElementById('resumeButton')
const cancelButton = document.getElementById('cancelButton')
const fileInput = document.getElementById('fileInput');

function createFileChunks(file, chunkSize) {
    const chunks = [];
    let offset = 0;

    while (offset < file.size) {
        const chunk = file.slice(offset, offset + chunkSize);
        chunks.push(chunk);
        offset += chunkSize;
    }

    return chunks;
}

async function uploadChunk(chunk, uploadUrl) {
    const formData = new FormData();
    formData.append('fileChunk', chunk);
    try {
        const encodedFileName = encodeURIComponent(fileName);
        await fetch(uploadUrl, {
            method: 'POST',
            body: formData,
            headers: {
                'X-File-Id': encodedFileName
            }
        });

    } catch (error) {
        console.error(error);
    }
}

async function finalizeUpload(uploadUrl) {
    try {
        const encodedFileName = encodeURIComponent(fileName);
        await fetch(uploadUrl, {
            method: 'POST',
            headers: {
                'X-File-Id': encodedFileName
            }
        });

    } catch (error) {
        console.error(error);
    }
}

async function uploadFileInChunks(file, chunkSize, uploadUrl) {
    isUploading = true;
    const chunks = createFileChunks(file, chunkSize);

    for (let i = 0; i < chunks.length && isUploading; i++) {
        await uploadChunk(chunks[i], uploadUrl);
        uploadedChunks.push(chunks[i]);
    }
}

startButton.addEventListener('click', async () => {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const chunkSize = 1024 * 1024;
    const uploadUrl = 'http://localhost:50000/upload';
    if (file) {
        startButton.style.display = "none"
        pauseButton.style.display = "inline-block"
        cancelButton.style.display = "inline-block"
        fileName = file.name + '_' + file.lastModified
    }
    await uploadFileInChunks(file, chunkSize, uploadUrl);
    await finalizeUpload(uploadUrl);
});

pauseButton.addEventListener('click', () => {
    isUploading = false;
    pauseButton.style.display = "none"
    resumeButton.style.display = "inline-block"
});

resumeButton.addEventListener('click', async () => {

    const file = fileInput.files[0];
    const chunkSize = 1024 * 1024;
    const uploadUrl = 'http://localhost:50000/upload';
    resumeButton.style.display = "none"
    pauseButton.style.display = "inline-block"
    await resumeUpload(file, chunkSize, uploadUrl);
});
cancelButton.addEventListener('click', () => {
    isUploading = false;
    uploadedChunks = [];
    fileName = ''
    startButton.style.display = "inline-block"
    cancelButton.style.display = "none"
    pauseButton.style.display = "none"
    resumeButton.style.display = "none"
    fileInput.value = []
});

async function resumeUpload(file, chunkSize, uploadUrl) {
    isUploading = true;
    const chunksToUpload = uploadedChunks.slice();

    while (chunksToUpload.length > 0 && isUploading) {
        const chunk = chunksToUpload.shift();
        try {
            await uploadChunk(chunk, uploadUrl);
        } catch (error) {
            isUploading = false;
            break;
        }
    }

    if (isUploading) {
        uploadedChunks = [];
    }
}
