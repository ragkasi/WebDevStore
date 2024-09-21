import { get, post, put, del } from '../shared/requests';

const getFilament = async (name: string) => {
  return await get(`/teams/filament/${name}`);
};

const getTeams = async () => {
  return await get('/teams/');
};

const getTeamsInstructed = async () => {
  return await get('/teams/instructed');
};

const getTeamByName = async (name: string) => {
  return await get(`/teams/${name}`);
};

const putTeam = async (teamId: string, team: Team) => {
  return await put(`/teams/${teamId}`, team);
};

const postTeam = async (name: string, sectionId: string) => {
  return await post('/teams/', { name, sectionId });
};

const getRosterTemplate = async () => {
  return await get('/teams/batch/template');
};

const postRoster = async (rosterPostData: any) => {
  return await post('/teams/batch/', rosterPostData);
};

const deleteTeam = async (teamId: string) => {
  return await del(`/teams/${teamId}`);
};

const deleteAllTeams = async () => {
  return await del('/teams/all');
};

export default {
  getFilament,
  getTeams,
  getTeamsInstructed,
  getTeamByName,
  postTeam,
  putTeam,
  getRosterTemplate,
  postRoster,
  deleteTeam,
  deleteAllTeams,
};
