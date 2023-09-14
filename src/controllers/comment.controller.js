'use strict'

const CommentService = require('../services/comment.service')
const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class CommentController {

    createComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Create Comment OK',
            metadata: await CommentService.createComment({
                ...req.body
            })
        }).send(res)
    }
    
    getCommentByParentId = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get Comment OK',
            metadata: await CommentService.getCommentById(req.query)
        }).send(res)
    }

    deleteComment = async (req, res, next) => {
        new SuccessResponse({
            message: 'Delete Comment OK',
            metadata: await CommentService.deleteComment(req.query)
        }).send(res)
    }

}

module.exports = new CommentController()