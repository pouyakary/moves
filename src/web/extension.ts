import * as vscode	from 'vscode';
import * as move 		from './moves';

// ─── Activate ──────────────────────────────────────────────────────────── ✣ ─

export function activate(context: vscode.ExtensionContext) {
	function registerCommandHandler(name: string, callback: () => Promise<void>) {
		const disposable = vscode.commands.registerCommand(name, callback);
		context.subscriptions.push(disposable);
	}

	registerCommandHandler('pillar.moveCursorUnderNextColumnAbove',
		move.cursorUnderNextColumnAbove);
	registerCommandHandler('pillar.moveCursorUnderNextColumnBelow',
		move.cursorUnderNextColumnBelow);

	registerCommandHandler('pillar.moveCursorUnderPreviousColumnAbove',
		move.cursorUnderPreviousColumnAbove);
	registerCommandHandler('pillar.moveCursorUnderPreviousColumnBelow',
		move.cursorUnderPreviousColumnBelow);

	registerCommandHandler('pillar.selectAllWordNeighborLines',
		move.selectAllWordNeighborLines);
}

// ─── Deactivate ────────────────────────────────────────────────────────── ✣ ─

export function deactivate() { }
