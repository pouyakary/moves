import * as vscode 		from 'vscode';
import * as commands 	from './commands/forward';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function register(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	register('indent.moveCursorUnderNextColumn', commands.moveForwardCommand);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
