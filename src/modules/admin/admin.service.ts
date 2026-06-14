import {
    findAllUsers,
    findAllReports,
    setUserActive,
    setReportStatus
} from './admin.repository';
import { NotFoundError } from 'elysia';

export async function listUsers(){
    return findAllUsers();
};

export async function activateUser(id: string){
    return setUserActive(id, true);
};

export async function deactivateUser(id: string){
    return setUserActive(id, false);
};

export async function listReports(){
    return findAllReports();
};

export async function resolveReport(id: string){
    return setReportStatus(id, 'resolved');
};

export async function dismissReport(id: string){
    return setReportStatus(id, 'dismissed');
}