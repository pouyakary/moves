import * as vscode  from 'vscode';
import * as actions from './actions';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function registerCommandHandler(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	registerCommandHandler('micemoves.moveCursorUnderNextColumnAbove',
		actions.cursorUnderNextColumnAbove);
	registerCommandHandler('micemoves.moveCursorUnderNextColumnBelow',
		actions.cursorUnderNextColumnBelow);

	registerCommandHandler('micemoves.moveCursorUnderPreviousColumnAbove',
		actions.cursorUnderPreviousColumnAbove);
	registerCommandHandler('micemoves.moveCursorUnderPreviousColumnBelow',
		actions.cursorUnderPreviousColumnBelow);

	registerCommandHandler('micemoves.selectAllWordNeighborLines',
		actions.addCursorToAllNeighborLines);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
