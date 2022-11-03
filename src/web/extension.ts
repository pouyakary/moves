import * as vscode  from 'vscode';
import * as actions from './actions';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function registerCommandHandler(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	registerCommandHandler('moves.moveCursorUnderNextColumnAbove',
		actions.cursorUnderNextColumnAbove);
	registerCommandHandler('moves.moveCursorUnderNextColumnBelow',
		actions.cursorUnderNextColumnBelow);

	registerCommandHandler('moves.moveCursorUnderPreviousColumnAbove',
		actions.cursorUnderPreviousColumnAbove);
	registerCommandHandler('moves.moveCursorUnderPreviousColumnBelow',
		actions.cursorUnderPreviousColumnBelow);

	registerCommandHandler('moves.selectAllWordNeighborLines',
		actions.addCursorToAllNeighborLines);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
