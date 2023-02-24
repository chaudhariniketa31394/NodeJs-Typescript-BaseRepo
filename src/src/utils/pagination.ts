export interface Pagination<T> {
  data: T[];
  limit: number;
  pageNumber: number;
  next: string;
  previous: string;
}

export default function paginate<T>(documents: T[], limit: number, pageNumber: number, path: string ): Pagination<T> {
 console.log("documents",documents)
 console.log("limit",limit)
 console.log(" pageNumber",pageNumber)
 console.log("path",path,"jjjjjjjjjjjjhhhhhhhhhhhh",process.env.BASE_URL)
  return {
    data: documents,
    limit,
    pageNumber,
    next: documents.length < limit ? '' : `${process.env.BASE_URL}${path}?page=${pageNumber + 1}`,
    previous: (pageNumber > 1) ? `${process.env.BASE_URL}${path}?page=${pageNumber - 1}` : '',
  };
}
