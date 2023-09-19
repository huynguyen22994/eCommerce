'use strict'

const express = require('express')
const CommentController = require('../../controllers/comment.controller')
const { asyncHandle } = require('../../helper/asyncHandle')
const { authenticationV2 } = require('../../auth/authUtils')
const router = express.Router()

router.use(authenticationV2)

router.post('', asyncHandle(CommentController.createComment))
router.get('', asyncHandle(CommentController.getCommentByParentId))
router.delete('', asyncHandle(CommentController.deleteComment))

module.exports = router