// provides local storage capability to load and save state
//

export const load_state = (key) => {

    try {
        const serialised_state = localStorage.getItem('state-' + key);

        if (serialised_state == null) {
            return undefined;
        }

        return JSON.parse(serialised_state);

    } catch (err) {
        return undefined;
    }
};

export const save_state = (key, state) => {

    try {
        const serialised_state = JSON.stringify(state);
        localStorage.setItem(('state-' + key), serialised_state);
    } catch (err) {
        // no op
    }
};
