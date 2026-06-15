import { db } from '../../db/client';
import { and, eq } from 'drizzle-orm'
import { reports } from '../../db/schema';

export async function createReport(data: {
    commentId: string,
    reportedBy: string,
    reason?: string
}) {
    const [report] = await db.insert(reports)
        .values(data).returning();
    if(!report) throw new Error('Erro ao criar denúncia!');
    return report;
};

export async function findExistingReport(commentId: string, reportedBy: string){
    return db.query.reports.findFirst({
        where: and(
            eq(reports.commentId, commentId),
            eq(reports.reportedBy, reportedBy)
        )
    });
};