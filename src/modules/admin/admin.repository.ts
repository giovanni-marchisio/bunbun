import { db } from '../../db/client';
import { eq } from 'drizzle-orm';
import { users, comments, reports } from '../../db/schema';

export async function findAllUsers(){
    return db.query.users.findMany({
        columns: {
            password: false
        }
    });
};

export async function setUserActive(id: string, active: boolean){
    const [user] = await db.update(users)
        .set({ active })
        .where(eq(users.id, id))
        .returning()

    if (!user) throw new Error('Usuário não encontrado!');
    return user;
};

export async function findAllReports(){
    return db.query.reports.findMany({
        where: eq(reports.status, 'pending'),
        with: {
            comment: true,
            reporter: true
        }
    });
};

export async function setReportStatus(id: string, status: 'resolved' | 'dismissed'){
    const [report] = await db.update(reports)
        .set({ status })
        .where(eq(reports.id, id))
        .returning()

    if (!report) throw new Error('Denúncia não foi encontrada!');
    return report
};