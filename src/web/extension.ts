import * as vscode	from 'vscode';
import * as move 		from './moves';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function registerCommandHandler(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	registerCommandHandler('pillar.moveCursorUnderNextColumn',
		move.cursorUnderNextColumn);
	registerCommandHandler('pillar.moveCursorUnderPreviousColumn',
		move.cursorUnderPreviousColumn);
	registerCommandHandler('pillar.addCursorToAllLinesOfSameColumn',
		move.addCursorToAllLinesOfSameColumn);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
