import types from '@store/types';
import utils from 'blue-utils';
import initState from '@store/state';

//视图相关的state
export function views ( state = initState.views, action: any ) {
	const {type, payload} = action;
	switch (type) {
		case types.VIEW:
			return utils.extend(state, payload);
		default:
			return state;
	}
}