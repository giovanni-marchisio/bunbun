import { db } from '../../db/client';
import { comments } from '../../db/schema';
import { eq, isNull, gt } from 'drizzle-orm';

export async function findComments(cursor: string | null, limit: number) {
  return db.query.comments.findMany({
    where: (comments, { and, isNull, gt }) => cursor
      ? and(
          isNull(comments.deletedAt),
          gt(comments.createdAt, new Date(Number(cursor)))
        )
      : isNull(comments.deletedAt),
    orderBy: (comments, { asc }) => asc(comments.createdAt),
    limit
  });
};

export async function findCommentById(id: string) {
    return db.query.comments.findFirst({
        where: eq(comments.id, id)
    });
};

export async function createComment(data: {
    content: string,
    authorId: string
}) {
    const [comment] = await db.insert(comments)
        .values(data).returning()
    if (!comment) throw new Error('Erro ao criar comentário!');
    return comment;
};

export async function softDeleteComment(id: string){
    await db.update(comments)
        .set({ deletedAt: new Date(), active: false})
        .where(eq(comments.id, id));
};