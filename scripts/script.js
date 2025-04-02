document.addEventListener('DOMContentLoaded', function () {
    const contentDiv = document.getElementById('content');

function parseContent(text, tabName) {
    const lines = text.split('\n');
    let tabImgsrc = `img/${tabName}.png`;

    let htmlContent = `<div id="tab-image"><img src="${tabImgsrc}" alt="Image for ${tabName}"></div>`;

    lines.forEach(line => {
        if (line.startsWith('title:')) {
            htmlContent += `<h2>${line.slice(6).trim()}</h2>`;
        } else if (line.startsWith('date:')) {
            const date = line.slice(5).trim();
            if (date.endsWith('t')) {
                htmlContent += `<p class="date">${date.slice(0, -1)}</p>`;
            }
        } else if (line.startsWith('text:')) {
            let textBody = line.slice(5).trim()
                .replace(/<horz>/g, '<hr>')
                .replace(/<video:(.+?)>/g, '<iframe width="560" height="315" src="$1" frameborder="0" allowfullscreen></iframe>')
                .replace(/<image:(.+?)>/g, '<img src="img/$1.png" alt="Image" class="inline-image">')
                .replace(/<link:(.+?)>/g, '<a href="$1" target="_blank">$1</a>'); // <-- Added parsing for link

            htmlContent += `<p>${textBody}</p>`;
        } else {
            let processedLine = line.trim()
                .replace(/<link:(.+?)>/g, '<a href="$1" target="_blank">$1</a>'); // handle link in other lines as well
            htmlContent += `<p>${processedLine}</p>`;
        }
    });

    return htmlContent;
}



    function loadContent(tabName) {
        fetch(`content/${tabName}.txt`)
            .then(response => response.text())
            .then(data => {
                contentDiv.innerHTML = parseContent(data, tabName);
            })
            .catch(error => contentDiv.innerHTML = `<p>Error loading content.</p>`);
    }

    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            loadContent(this.getAttribute('data-tab'));
        });
    });

    document.getElementById('homeIcon').addEventListener('click', function () {
        loadContent('home');
    });

    loadContent('home');
});