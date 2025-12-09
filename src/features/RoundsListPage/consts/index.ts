import { StatusFilter } from "../types";

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Everyone' },
    { value: 'active', label: 'Active' },
    { value: 'cooldown', label: 'Cooldown' },
    { value: 'finished', label: 'Finished' },
];