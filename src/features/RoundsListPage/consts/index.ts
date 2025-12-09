import { StatusFilter } from "../types";

export const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'Все' },
    { value: 'active', label: 'Активные' },
    { value: 'cooldown', label: 'Cooldown' },
    { value: 'finished', label: 'Завершённые' },
];