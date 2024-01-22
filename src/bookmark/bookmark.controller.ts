import { Controller, Delete, Patch, Post, Get, Param, ParseIntPipe, UseGuards, Body, HttpCode } from '@nestjs/common';
import { JwtGuard } from 'src/auth/guard';
// import { JwtGuard } from '../../src/auth/guard';
import { BookmarkService } from './bookmark.service';
// import { GetUser } from '../../src/auth/decorator';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { EditBookmarkDto } from './dto/edit-bookmark.dto';
import { GetUser } from 'src/auth/decorator';
import { HttpStatusCode } from 'axios';

@UseGuards(JwtGuard)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarkService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUser('id') userId: number) {
    return this.bookmarkService.getBookmarks(userId)
  }

  @Get(':id')
  getBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.getBookmarkById(userId, bookmarkId)
  }

  @Post()
  createBookmark(@GetUser('id') userId: number, @Body() dto: CreateBookmarkDto) {
    return this.bookmarkService.createBookmark(userId, dto)
  }

  @Patch(':id')
  editBookmarById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number, @Body() dto: EditBookmarkDto) {
    return this.bookmarkService.editBookmarById(userId, bookmarkId, dto)
  }

  @HttpCode(HttpStatusCode.NoContent)
  @Delete(':id')
  deleteBookmarkById(@GetUser('id') userId: number, @Param('id', ParseIntPipe) bookmarkId: number) {
    return this.bookmarkService.deleteBookmarkById(userId, bookmarkId);
  }
}
