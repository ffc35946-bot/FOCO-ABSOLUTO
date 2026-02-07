
import { Plan } from './types';

export const INITIAL_DISCIPLINA = 20;
export const DISCIPLINA_PENALTY = 10;
export const CHECKIN_WINDOW_HOURS = 24;

export const PLAN_LIMITS = {
    [Plan.Gratuito]: 1,
    [Plan.PRO]: 5,
};

export const STORE_PACKAGE = {
    disciplina: 30,
    price: 6.00,
};
