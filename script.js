(function() {
    const textarea = document.getElementById('markdown-input');
    const preview = document.getElementById('preview');

    // Обработка превью
    let renderTimeout;
    function updatePreview() {
        clearTimeout(renderTimeout);
        renderTimeout = setTimeout(() => {
            const markdown = textarea.value;
            const html = marked.parse(markdown);
            preview.innerHTML = html;
            if (window.MathJax) {
                MathJax.typesetPromise();
            }
        }, 300);
    }

    textarea.addEventListener('input', updatePreview);

    // Копирование отформатированного текста
    window.copyFormatted = async function() {
        try {
            const htmlContent = preview.innerHTML;
            const textContent = preview.textContent;
            
            await navigator.clipboard.write([
                new ClipboardItem({
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                    'text/plain': new Blob([textContent], { type: 'text/plain' })
                })
            ]);
            alert('Форматированный текст скопирован!');
        } catch (err) {
            alert('Ошибка копирования!');
        }
    };

    // Экспорт файла
    window.exportFile = function(type) {
        const htmlContent = preview.innerHTML;
        const textContent = preview.textContent;

        function downloadFile(content, mimeType, fileName) {
            const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }

        switch(type) {
            case 'txt':
                downloadFile(textContent, 'text/plain', 'document.txt');
                break;
            case 'docx':
                const docxBlob = htmlDocx.asBlob(htmlContent);
                downloadFile(docxBlob, 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'document.docx');
                break;
        }
    };

    // MathJax конфигурация
    window.MathJax = {
        tex: {
            inlineMath: [['$', '$'], ['\\(', '\\)']]
        },
        options: {
            processHtmlClass: 'mathjax-process'
        },
        startup: {
            typeset: false
        }
    };
})();