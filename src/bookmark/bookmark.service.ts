import { Injectable } from '@nestjs/common';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';

@Injectable()
export class BookmarkService {

  getBookmarks(userId: number) {

  }

  getBookmarkById(userId:number, bookmarkId: number) {}

  createBookmark(userId:number, dto: CreateBookmarkDto) {}

  editBookmarById(userId:number, bookmarkId: number, dto: EditBookmarkDto) {}

  deleteBookmarkById(userId: number, bookmarkId: number) {}
}
