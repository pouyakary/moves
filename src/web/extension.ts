import * as vscode	from 'vscode';
import * as move 		from './moves';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function register(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	register('move.cursorUnderNextColumn', move.cursorUnderNextColumn);
	register('move.cursorUnderPreviousColumn', move.cursorUnderPreviousColumn);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
