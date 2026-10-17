import type { IeRule, UF } from './types';
import { ac } from './rules/ac';
import { al } from './rules/al';
import { am } from './rules/am';
import { ap } from './rules/ap';
import { ba } from './rules/ba';
import { ce } from './rules/ce';
import { df } from './rules/df';
import { es } from './rules/es';
import { go } from './rules/go';
import { ma } from './rules/ma';
import { mg } from './rules/mg';
import { ms } from './rules/ms';
import { mt } from './rules/mt';
import { pa } from './rules/pa';
import { pb } from './rules/pb';
import { pe } from './rules/pe';
import { pi } from './rules/pi';
import { pr } from './rules/pr';
import { rj } from './rules/rj';
import { rn } from './rules/rn';
import { ro } from './rules/ro';
import { rr } from './rules/rr';
import { rs } from './rules/rs';
import { sc } from './rules/sc';
import { se } from './rules/se';
import { sp } from './rules/sp';
import { to } from './rules/to';

/** Mapa UF → regra de validação da Inscrição Estadual. */
export const registry: Readonly<Record<UF, IeRule>> = {
  AC: ac,
  AL: al,
  AM: am,
  AP: ap,
  BA: ba,
  CE: ce,
  DF: df,
  ES: es,
  GO: go,
  MA: ma,
  MG: mg,
  MS: ms,
  MT: mt,
  PA: pa,
  PB: pb,
  PE: pe,
  PI: pi,
  PR: pr,
  RJ: rj,
  RN: rn,
  RO: ro,
  RR: rr,
  RS: rs,
  SC: sc,
  SE: se,
  SP: sp,
  TO: to,
};
