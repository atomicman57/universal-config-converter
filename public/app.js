// Configuration
const API_BASE = '/api';

// DOM Elements
const tabs = {
    buttons: document.querySelectorAll('.tab-button'),
  contents: document.querySelectorAll('.tab-content')
};

const single = {
    sourceEditor: document.getElementById('source-editor'),
    targetEditor: document.getElementById('target-editor'),
    sourceFormat: document.getElementById('source-format'),
    targetFormat: document.getElementById('target-format'),
    dropZone: document.getElementById('drop-zone'),
    fileInput: document.getElementById('file-input'),
    loadFileBtn: document.getElementById('load-file-btn'),
    clearSourceBtn: document.getElementById('clear-source-btn'),
    convertBtn: document.getElementById('convert-btn'),
    downloadBtn: document.getElementById('download-btn'),
    copyBtn: document.getElementById('copy-btn'),
    prettyPrint: document.getElementById('pretty-print'),
    sortKeys: document.getElementById('sort-keys'),
    indentSize: document.getElementById('indent-size')
};

const batch = {
    dropZone: document.getElementById('batch-drop-zone'),
    fileInput: document.getElementById('batch-file-input'),
    targetFormat: document.getElementById('batch-target-format'),
    prettyPrint: document.getElementById('batch-pretty'),
    sortKeys: document.getElementById('batch-sort'),
    convertBtn: document.getElementById('batch-convert-btn'),
    results: document.getElementById('batch-results'),
    resultsList: document.getElementById('batch-results-list'),
    downloadAllBtn: document.getElementById('download-all-btn')
};

const errorDisplay = {
    container: document.getElementById('error-display'),
    message: document.getElementById('error-message'),
    closeBtn: document.getElementById('close-error')
};

// State
let batchFiles = [];
let convertedResults = [];

// Tab Switching
tabs.buttons.forEach(button => {
    button.addEventListener('click', () => {
        const tabName = button.dataset.tab;

        // Update buttons
        tabs.buttons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update content
        tabs.contents.forEach(content => {
            content.classList.toggle('active', content.id === `${tabName}-mode`);
        });
    });
});

// Error Handling
function showError(message) {
    errorDisplay.message.textContent = message;
    errorDisplay.container.classList.remove('hidden');
}

function hideError() {
    errorDisplay.container.classList.add('hidden');
}

errorDisplay.closeBtn.addEventListener('click', hideError);

// Single File Mode - Drop Zone
single.sourceEditor.addEventListener('focus', () => {
    if (!single.sourceEditor.value) {
        single.dropZone.classList.add('active');
    }
});

single.sourceEditor.addEventListener('blur', () => {
    setTimeout(() => {
        single.dropZone.classList.remove('active');
    }, 200);
});

single.sourceEditor.addEventListener('input', () => {
    if (single.sourceEditor.value) {
        single.dropZone.classList.remove('active');
    }
});

single.dropZone.addEventListener('click', () => {
    single.fileInput.click();
});

single.loadFileBtn.addEventListener('click', () => {
    single.fileInput.click();
});

// Drag and Drop
[single.dropZone, batch.dropZone].forEach(dropZone => {
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });

    dropZone.addEventListener('dragleave', () => {
        dropZone.classList.remove('drag-over');
    });

    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');

        const files = Array.from(e.dataTransfer.files);

        if (dropZone === single.dropZone) {
            if (files.length > 0) {
                loadSingleFile(files[0]);
            }
        } else {
            handleBatchFiles(files);
        }
    });
});

// File Input Handlers
single.fileInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        loadSingleFile(e.target.files[0]);
    }
});

batch.fileInput.addEventListener('change', (e) => {
    handleBatchFiles(Array.from(e.target.files));
});

batch.dropZone.addEventListener('click', () => {
    batch.fileInput.click();
});

// Load Single File
function loadSingleFile(file) {
    const reader = new FileReader();
    const ext = file.name.split('.').pop().toLowerCase();

    reader.onload = (e) => {
        single.sourceEditor.value = e.target.result;
        single.dropZone.classList.remove('active');

        // Auto-detect format
        if (ext === 'json') single.sourceFormat.value = 'json';
        else if (ext === 'yaml' || ext === 'yml') single.sourceFormat.value = 'yaml';
        else if (ext === 'toml') single.sourceFormat.value = 'toml';
        else if (ext === 'env') single.sourceFormat.value = 'env';

        // Auto-convert if enabled
        autoConvert();
    };

    reader.readAsText(file);
}

// Auto Convert (with debouncing)
let autoConvertTimeout;
function autoConvert() {
    clearTimeout(autoConvertTimeout);
    autoConvertTimeout = setTimeout(() => {
        if (single.sourceEditor.value.trim()) {
            convertSingle();
        }
    }, 500);
}

single.sourceEditor.addEventListener('input', autoConvert);
single.sourceFormat.addEventListener('change', autoConvert);
single.targetFormat.addEventListener('change', autoConvert);
single.prettyPrint.addEventListener('change', autoConvert);
single.sortKeys.addEventListener('change', autoConvert);
single.indentSize.addEventListener('change', autoConvert);

// Convert Single
single.convertBtn.addEventListener('click', convertSingle);

async function convertSingle() {
    const content = single.sourceEditor.value.trim();

    if (!content) {
        showError('Please enter some config content to convert');
        return;
    }

    hideError();

    const options = {
        pretty: single.prettyPrint.checked,
        indent: parseInt(single.indentSize.value),
        sort: single.sortKeys.checked
    };

    try {
        const response = await fetch(`${API_BASE}/convert`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content,
                fromFormat: single.sourceFormat.value,
                toFormat: single.targetFormat.value,
                options
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Conversion failed');
        }

        single.targetEditor.value = data.result;
  single.downloadBtn.disabled = false;
        single.copyBtn.disabled = false;

    } catch (error) {
        showError(error.message);
        single.targetEditor.value = '';
        single.downloadBtn.disabled = true;
        single.copyBtn.disabled = true;
    }
}

// Clear Source
single.clearSourceBtn.addEventListener('click', () => {
  single.sourceEditor.value = '';
  single.targetEditor.value = '';
    single.downloadBtn.disabled = true;
    single.copyBtn.disabled = true;
    hideError();
});

// Download
single.downloadBtn.addEventListener('click', () => {
    const content = single.targetEditor.value;
    const format = single.targetFormat.value;
    const ext = format === 'yaml' ? '.yaml' : `.${format}`;
  const filename = `config${ext}`;

    downloadFile(filename, content);
});

// Copy to Clipboard
single.copyBtn.addEventListener('click', async () => {
    try {
        await navigator.clipboard.writeText(single.targetEditor.value);
        const originalText = single.copyBtn.textContent;
        single.copyBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            single.copyBtn.textContent = originalText;
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
});

// Batch Mode
function handleBatchFiles(files) {
    batchFiles = files;
    batch.convertBtn.disabled = files.length === 0;

    // Show file count
    if (files.length > 0) {
        batch.dropZone.querySelector('h3').textContent = `${files.length} file(s) selected`;
        batch.dropZone.querySelector('p').textContent = 'Click to select different files';
    }
}

// Batch Convert
batch.convertBtn.addEventListener('click', async () => {
    if (batchFiles.length === 0) return;

    batch.convertBtn.disabled = true;
    batch.convertBtn.innerHTML = '<span class="spinner"></span> Converting...';

    const formData = new FormData();
    batchFiles.forEach(file => {
        formData.append('files', file);
    });

    const options = {
        pretty: batch.prettyPrint.checked,
        sort: batch.sortKeys.checked
    };

    formData.append('toFormat', batch.targetFormat.value);
    formData.append('options', JSON.stringify(options));

    try {
        const response = await fetch(`${API_BASE}/convert/batch`, {
            method: 'POST',
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Batch conversion failed');
        }

        convertedResults = data.results;
        displayBatchResults(data.results);

    } catch (error) {
        showError(error.message);
    } finally {
        batch.convertBtn.disabled = false;
        batch.convertBtn.innerHTML = '⚡ Convert All Files';
    }
});

// Display Batch Results
function displayBatchResults(results) {
    batch.resultsList.innerHTML = '';

  results.forEach((result, index) => {
        const item = document.createElement('div');
        item.className = `batch-result-item ${result.success ? 'success' : 'error'}`;

        const info = document.createElement('div');
        const filename = document.createElement('div');
        filename.className = 'result-filename';
        filename.textContent = result.originalName;

        const status = document.createElement('div');
        status.className = 'result-status';
        status.textContent = result.success
            ? `✓ Converted to ${result.newName}`
            : `✗ Error: ${result.error}`;

        info.appendChild(filename);
        info.appendChild(status);

        const actions = document.createElement('div');
        actions.className = 'result-actions';

  if (result.success) {
            const downloadBtn = document.createElement('button');
            downloadBtn.className = 'btn btn-primary btn-small';
            downloadBtn.textContent = '💾 Download';
            downloadBtn.addEventListener('click', () => {
                downloadFile(result.newName, result.content);
            });
            actions.appendChild(downloadBtn);
        }

        item.appendChild(info);
        item.appendChild(actions);
        batch.resultsList.appendChild(item);
    });

    batch.results.classList.remove('hidden');
}

// Download All as ZIP (simple multiple downloads)
batch.downloadAllBtn.addEventListener('click', () => {
    convertedResults
        .filter(r => r.success)
        .forEach((result, index) => {
            setTimeout(() => {
                downloadFile(result.newName, result.content);
            }, index * 200);
        });
});

// Helper: Download File
function downloadFile(filename, content) {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Initialize
console.log('🔄 Universal Config Converter initialized');



export const BUILD_VERSION = 'jrtos';


export const BUILD_VERSION = 'up12ky';

export const BUILD_VERSION = '9dk6jp';






export const BUILD_VERSION = '1phqo';

// Updated: 2026-01-03

// Updated: 2026-01-03
