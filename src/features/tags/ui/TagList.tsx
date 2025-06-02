import { Link } from '@tanstack/react-router'
import type { TagInfo } from '../../../entities/post/types'
import { styled } from "styled-system/jsx"

interface TagListProps {
  tags: TagInfo[]
}

const Container = styled('div', {
  base: { maxW: '1280px', mx: 'auto', px: 4, py: 8 },
})

const Heading = styled('h1', { base: { fontSize: '3xl', fontWeight: 'bold', mb: 8 } })

const Grid = styled('div', {
  base: {
    display: 'grid',
    gap: 4,
    gridTemplateColumns: { base: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
  },
})

const Card = styled(Link, {
  base: {
    display: 'block',
    p: 4,
    bg: 'white',
    rounded: 'lg',
    shadow: 'md',
    borderWidth: '1px',
    borderColor: 'gray.200',
    transitionProperty: 'shadow',
    _hover: { shadow: 'lg' },
  },
})

const CardHeader = styled('div', {
  base: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
})

const CardTitle = styled('h3', { base: { fontSize: 'lg', fontWeight: 'semibold', color: 'gray.800' } })

const Badge = styled('span', {
  base: { bg: 'blue.100', color: 'blue.800', fontSize: 'sm', fontWeight: 'medium', px: 2.5, py: 0.5, rounded: 'md' },
})

const Description = styled('p', { base: { color: 'gray.600', fontSize: 'sm', mt: 2 } })

const EmptyWrap = styled('div', { base: { textAlign: 'center', py: 12 } })
const EmptyText = styled('p', { base: { color: 'gray.500', fontSize: 'lg' } })

export function TagList({ tags }: TagListProps) {
  return (
    <Container>
      <Heading>태그</Heading>
      <Grid>
        {tags.map((tag) => (
          <Card
            key={tag.name}
            to="/tags/$tagName"
            params={{ tagName: tag.name }}
            data-testid="tag-item"
          >
            <CardHeader>
              <CardTitle>
                {tag.name}
              </CardTitle>
              <Badge>
                {tag.count}
              </Badge>
            </CardHeader>
            <Description>
              {tag.count}개의 포스트
            </Description>
          </Card>
        ))}
      </Grid>
      
      {tags.length === 0 && (
        <EmptyWrap>
          <EmptyText>아직 태그가 없습니다.</EmptyText>
        </EmptyWrap>
      )}
    </Container>
  )
} 