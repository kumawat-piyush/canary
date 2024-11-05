import React from 'react'
import cx from 'classnames'
import { CheckCircleSolid, WarningTriangleSolid, Clock, ChatBubbleQuestionSolid } from '@harnessio/icons-noir'
import {
  Button,
  Avatar,
  AvatarFallback,
  Icon,
  Text,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '@harnessio/canary'
import { EnumPullReqReviewDecision, PullReqReviewDecision } from './interfaces'
import { getInitials } from '../../utils/utils'

interface PullRequestSideBarProps {
  reviewers?: {
    reviewer?: { display_name?: string; id?: number }
    review_decision?: EnumPullReqReviewDecision
    sha?: string
  }[]
  processReviewDecision: (
    review_decision: EnumPullReqReviewDecision,
    reviewedSHA?: string,
    sourceSHA?: string
  ) => EnumPullReqReviewDecision | PullReqReviewDecision.outdated
  pullRequestMetadata?: { source_sha: string }
  refetchReviewers: () => void
  handleDelete: (id: number) => void
}

const PullRequestSideBar = (props: PullRequestSideBarProps) => {
  const { reviewers = [], pullRequestMetadata, processReviewDecision, refetchReviewers, handleDelete } = props

  const ReviewerItem = ({
    reviewer,
    reviewDecision,
    sha,
    sourceSHA
  }: {
    reviewer?: { display_name?: string; id?: number }
    reviewDecision?: EnumPullReqReviewDecision
    sha?: string
    sourceSHA?: string
  }) => {
    const updatedReviewDecision = reviewDecision && processReviewDecision(reviewDecision, sha, sourceSHA)
    const moreActionsTooltip = (
      reviewer:
        | {
            display_name?: string
            id?: number
          }
        | undefined
    ) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="xs">
              <Icon name="vertical-ellipsis" size={14} className="text-tertiary-background" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="rounded-[10px] w-[180px]">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer text-red-400 hover:text-red-400 focus:text-red-400"
                onSelect={() => {
                  handleDelete?.(reviewer?.id ?? 0)
                }}>
                <DropdownMenuShortcut className="ml-0">
                  <Icon name="trash" className="mr-2 text-red-400" />
                </DropdownMenuShortcut>
                Delete Reviewer
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    }
    return (
      <div key={reviewer?.id} className="flex items-center space-x-2 mr-1">
        <Avatar
          className={cx('w-7 h-7 rounded-full', {
            'p-0': updatedReviewDecision !== PullReqReviewDecision.changeReq
          })}>
          <AvatarFallback>
            <Text size={1} color="tertiaryBackground">
              {getInitials(reviewer?.display_name || '')}
            </Text>
          </AvatarFallback>
        </Avatar>
        <div className="truncate reviewerName">{reviewer?.display_name}</div>
        <div className="flex-grow"></div>

        {updatedReviewDecision === PullReqReviewDecision.outdated ? (
          <ChatBubbleQuestionSolid className="text-warning" />
        ) : updatedReviewDecision === PullReqReviewDecision.approved ? (
          <CheckCircleSolid className="text-success" />
        ) : updatedReviewDecision === PullReqReviewDecision.changeReq ? (
          <WarningTriangleSolid className="text-destructive" />
        ) : updatedReviewDecision === PullReqReviewDecision.pending ? (
          <Clock />
        ) : null}
        {moreActionsTooltip(reviewer)}
      </div>
    )
  }

  const ReviewersList = () => (
    <div className="flex flex-col gap-3">
      {reviewers.length ? (
        reviewers.map(({ reviewer, review_decision, sha }) => (
          <ReviewerItem
            key={reviewer?.id}
            reviewer={reviewer}
            reviewDecision={review_decision}
            sha={sha}
            sourceSHA={pullRequestMetadata?.source_sha}
          />
        ))
      ) : (
        <Text size={2} weight="medium" color="tertiaryBackground">
          No reviewers
        </Text>
      )}
    </div>
  )

  const ReviewersHeader = () => (
    <div className="flex justify-between items-center">
      <Text size={2} weight="medium">
        Reviewers
      </Text>
      <Button size="sm" variant="ghost" className="px-2 py-1" onClick={refetchReviewers}>
        <Icon name="vertical-ellipsis" size={12} />
      </Button>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col gap-3">
        <ReviewersHeader />
        <ReviewersList />
      </div>
    </div>
  )
}

export { PullRequestSideBar }
