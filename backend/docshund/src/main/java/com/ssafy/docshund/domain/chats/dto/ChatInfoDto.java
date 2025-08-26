package com.ssafy.docshund.domain.chats.dto;

import java.time.LocalDateTime;

import com.querydsl.core.annotations.QueryProjection;
import com.ssafy.docshund.domain.chats.entity.Chat;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatInfoDto {

    private Integer docsId;
    private Long chatId;
    private String content;
    private LocalDateTime createdAt;
    private Long userId;
    private String nickName;
    private String profileImg;

    @QueryProjection
    public ChatInfoDto(Integer docsId, Long chatId, String content, LocalDateTime createdAt, Long userId, String nickName, String profileImg) {
        this.docsId = docsId;
        this.chatId = chatId;
        this.content = content;
        this.createdAt = createdAt;
        this.userId = userId;
        this.nickName = nickName;
        this.profileImg = profileImg;
    }

    public static ChatInfoDto from(Chat chat) {

        return new ChatInfoDto(
                chat.getDocument().getDocsId(),
                chat.getChatId(),
                chat.getContent(),
                chat.getCreatedAt(),
                chat.getUser().getUserId(),
                chat.getUser().getNickname(),
                chat.getUser().getProfileImage()
        );
    }
}
