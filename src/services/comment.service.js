'use strict'

const Comment = require('../models/comment.model')
const { convertToObjectIdMongo } = require('../utils/index')
const { NotFoundError } = require('../core/error.response')
const { findProduct } = require('../models/repositories/product.repo')

/**
 * Key feature: Comment service
 * + add comment [User, Shop]
 * + get a list of comments [User, Shop]
 * + delete a comment [User | Shop | Admin]
 */
class CommentService {

    static createComment = async ({ productId, userId, content, parentCommentId = null }) => {
        const comment = new Comment({
            comment_productId: productId,
            comment_userId: userId,
            comment_content: content,
            comment_parentId: parentCommentId
        })

        let rightValue
        if(parentCommentId) {
            // reply comment
            const parentComment = await Comment.findById(parentCommentId)
            if(!parentComment) throw new NotFoundError('Error: Parent comment is not found!')

            rightValue = parentComment.comment_right
            // updateMany comments

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_right: { $gte: rightValue }
            }, {
                $inc: { comment_right: 2 }
            })

            await Comment.updateMany({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: { $gt: rightValue }
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await Comment.findOne({
                comment_productId: convertToObjectIdMongo(productId)
            }, 'comment_right', { sort: { comment_right: -1 } })
            if(maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }
        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        await comment.save()
        return comment
    }

    static getCommentById = async ({ productId, parentCommentId = null, limit = 50, offset = 0 }) => {
        if(parentCommentId) {
            const parent = await Comment.findById(parentCommentId)
            if(!parent) throw new NotFoundError('Error: Not found for product!')
            const comments = await Comment.find({
                comment_productId: convertToObjectIdMongo(productId),
                comment_left: { $gt: parent.comment_left }, // lấy equal là lấy luôn comment cha
                comment_right: { $lte: parent.comment_right } // lấy equal là lấy luôn comment cha
            }).select({
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parentId: 1
            }).sort({
                comment_left: 1
            })

            return comments
        }

        // Root comment dont have child
        const comments = await Comment.find({
            comment_productId: convertToObjectIdMongo(productId),
            comment_parentId: parentCommentId
        }).select({
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parentId: 1
        }).sort({
            comment_left: 1
        })

        return comments
    }

    static deleteComment = async ({ commentId, productId }) => {
        // check the product exist in the database
        const foundProduct = await findProduct({
            product_id: productId
        })
        if(!foundProduct) throw new NotFoundError()

        // 1. Xác định giá trị left vs right của commentId
        const foundComment = await Comment.findById(commentId)
        if(!foundComment) throw new NotFoundError('Error: Comment not found')
        
        const leftValue = foundComment.comment_left
        const rightValue = foundComment.comment_right
        // 2. Tính Width của các comment con
        const width = rightValue - leftValue + 1
        // 3. Xóa tất cả commentId con
        await Comment.deleteMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_left: { $gte: leftValue, $lte: rightValue }
        })
        // 4. Update lại left right của các comment có left right lớn hơn found comment
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_left: { $gt: rightValue }
        }, {
            $inc: {
                comment_left: -width
            }
        })
        await Comment.updateMany({
            comment_productId: convertToObjectIdMongo(productId),
            comment_right: { $gt: rightValue }
        }, {
            $inc: {
                comment_right: -width
            }
        })

        return true
    }

}

module.exports = CommentService