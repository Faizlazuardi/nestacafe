import { useState, useCallback } from 'react';

export function useModals() {
    const [modals, setModals] = useState<boolean>(false);

    const open = useCallback(() => {
        setModals( true );
    }, []);

    const close = useCallback(() => {
        setModals( false );
    }, []);

    return { modals, open, close };
}
