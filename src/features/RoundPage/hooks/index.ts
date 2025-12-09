import { getRound } from "@/shared/api/rounds";
import { RoundDetails } from "@/shared/types/rounds";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { getClientStatus, getTimer } from "../utils";

function useNow(tickMs: number = 1000) {
    const [now, setNow] = useState(() => Date.now());

    useEffect(() => {
        const id = setInterval(() => setNow(Date.now()), tickMs);
        return () => clearInterval(id);
    }, [tickMs]);

    return now;
}

export function useRound(id?: string) {
    const now = useNow(1000);

    const query = useQuery<RoundDetails>({
        queryKey: ['round', id],
        queryFn: () => getRound(id!),
        enabled: Boolean(id),
    });

    const round = query.data;

    const clientStatus = round ? getClientStatus(round, now) : undefined;
    const timer = round ? getTimer(round, now) : { label: '', value: '' };

    return {
        ...query,
        round,
        now,
        clientStatus,
        timer,
    };
}