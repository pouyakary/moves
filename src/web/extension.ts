import * as vscode from 'vscode';
import { SpaceComputationContext } from './context';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('indent.moveCursorUnderNextColumn', async () => {
		let computationContext = new SpaceComputationContext();

		await replace(
			computationContext.currentLine,
			computationContext.newLineContent,
		);

  	await vscode.commands.executeCommand("cursorLineEnd");
	});

	context.subscriptions.push(disposable);
}

async function replace(line: number, text: string) {
	const editor = vscode.window.activeTextEditor;

  if (editor) {
    editor.edit(textEditorEdit => {
      const {range} = editor.document.lineAt(line);
      textEditorEdit.replace(range, text);
    });

    await vscode.commands.executeCommand('cancelSelection');
  }
}

// this method is called when your extension is deactivated
export function deactivate() {}
