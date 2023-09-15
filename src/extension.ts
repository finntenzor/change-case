// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import change, { validCases } from './change-case';
import { readFile, writeFile } from 'fs';
import { join as pathJoin } from 'path';

export interface Store {
	currentStatus: number;
	enabledStatus: string[];
    didUserAction: boolean;
}

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	const store: Store = {
		// The current case status index
		currentStatus: 0,
		// The enabled status string list
		enabledStatus: ['CamelCase', 'PascalCase', 'ConstantCase'],
        // Whether the user has actively modified key code
        didUserAction: false
	};

	const keyCodePattern = /^\d+$/;

    const keyCodeLocalFilePath = pathJoin(context.extensionPath, 'keycode.txt');

    function setKeyCode(newKeyCode:string) {
        const codes = newKeyCode.split('');
        const indexes = codes.map(code => parseInt(code));
        const newStatusList = indexes.map(index => validCases[index]);
        store.enabledStatus = newStatusList;
    }

    function onLoad() {
        readFile(keyCodeLocalFilePath, (err, data) => {
            if (err) {
                // do nothing, leave status default
                console.log('change-case: keycode storage read error, use default');
            } else {
                if (store.didUserAction) {
                    // do nothing if user change key code before file is loaded
                } else {
                    const keyCode = data.toString();
                    setKeyCode(keyCode);
                    console.log('change-case: keycode storage read ok. key code:', keyCode);
                }
            }
        });
    }

	let setKeyCodeDisposable = vscode.commands.registerCommand('change-case.setKeyCode', () => {
		vscode.window.showInputBox({
			placeHolder: 'example: 012',
			prompt: '0 = camelCase, 1 = PascalCase, 2 = CONSTANT_CASE, 3 = snake_case, 4 = kebab-case',
			validateInput: text => {
				if (!keyCodePattern.test(text)) {
					return 'The key code should consist only numbers';
				}
				return '';
			}
		}).then(keyCode => {
			if (!keyCode) {
				return;
			}

            // Record that the user has actively modified keycode
            store.didUserAction = true;

			setKeyCode(keyCode);

            // Maybe keycode write failed if user close vscode too fast
            // But this is not common and there is not need to resolve it
            writeFile(keyCodeLocalFilePath, keyCode, 'utf-8', () => {
                console.log('change-case: keycode storage write ok');
            });
		});
	});

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let changeCaseDisposable = vscode.commands.registerTextEditorCommand('change-case.changeCase', (textEditor: vscode.TextEditor, edit: vscode.TextEditorEdit) => {

        // change all the selections
		textEditor.selections.forEach(selection => {
			const originText = textEditor.document.getText(selection);
			const newText = change(originText, store.enabledStatus[store.currentStatus]);
			edit.replace(selection, newText);
		});

        // change case of current word if no selection
        if (textEditor.selection.isEmpty) {
            const previousStatus = store.currentStatus === 0 ? store.enabledStatus.length - 1 : store.currentStatus - 1;
            const currentCursorPosition: vscode.Position = textEditor.selection.start;
            const regex = store.enabledStatus[previousStatus] === 'KebabCase' ? /[-_$a-zA-Z0-9]+/ : /[_$a-zA-Z0-9]+/;
            const currentWordRange = textEditor.document.getWordRangeAtPosition(currentCursorPosition, regex);
            if (currentWordRange) {
                const originText = textEditor.document.getText(currentWordRange);
                const newText = change(originText, store.enabledStatus[store.currentStatus]);

                // 虽然不知道为什么 但是直接调用replace没反应
                // I don't know why this line of code doesn't work. :(
                // edit.replace(currentWordRange, newText);

                // change the case of current word
                textEditor.edit(builder => {
                    builder.replace(currentWordRange, newText);
                });
            }
        }

        // switch to next status
        store.currentStatus = (store.currentStatus + 1 ) % store.enabledStatus.length;
	});

	context.subscriptions.push(setKeyCodeDisposable);
	context.subscriptions.push(changeCaseDisposable);

    onLoad();
}

// this method is called when your extension is deactivated
export function deactivate() {}
