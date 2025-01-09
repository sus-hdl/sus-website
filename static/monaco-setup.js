require(['vs/editor/editor.main'], function () {
    // SUS Sprache registrieren
    monaco.languages.register({ id: 'sus' });

    // Syntax-Highlighting für SUS
    monaco.languages.setMonarchTokensProvider('sus', {
        tokenizer: {
            root: [
                [/\/\/.*/, 'comment'], // Kommentare
                [/\b(int|bool|reg|state|initial)\b/, 'keyword'], // Schlüsselwörter
                [/\b(module|struct|action)\b/, 'type'], // Typen
                [/\d+/, 'number'], // Zahlen
                [/".*?"/, 'string'], // Strings
                [/[{}()[\]]/, 'delimiter'], // Klammern
            ]
        }
    });

    // Sprach-Konfiguration für SUS
    monaco.languages.setLanguageConfiguration('sus', {
        comments: {
            lineComment: '//',
            blockComment: ['/*', '*/'],
        },
        brackets: [
            ['{', '}'],
            ['[', ']'],
            ['(', ')']
        ]
    });

    // Editor erstellen
    const editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '// Schreibe deinen SUS-Code hier\n',
        language: 'sus',
        theme: 'vs-dark',
        automaticLayout: true,
    });

    // WebSocket Verbindung zum LSP-Server
    const webSocket = new WebSocket('ws://localhost:8080'); // Passe die URL deines LSP-Servers an

    webSocket.onopen = () => {
        console.log('WebSocket verbunden');

        const { listen } = window.monaco.jsonrpc;
        const { MonacoLanguageClient, createConnection } = window.monaco.languageclient;

        listen({
            webSocket,
            onConnection: (connection) => {
                const languageClient = new MonacoLanguageClient({
                    name: 'SUS Language Client',
                    clientOptions: {
                        documentSelector: [{ language: 'sus' }],
                        synchronization: {
                            didSave: true,
                            didOpen: true,
                            didChange: true,
                        },
                    },
                    connectionProvider: {
                        get: () => Promise.resolve(connection),
                    },
                });

                languageClient.start();
                connection.onClose(() => languageClient.stop());
            },
        });
    };

    webSocket.onclose = () => console.log('WebSocket geschlossen');
});