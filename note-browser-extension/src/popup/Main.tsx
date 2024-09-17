import { Box, Button, Container, TextField } from "@mui/material"
import React from "react"

interface MainProps {
  created: boolean
  onCreate: (title: string, instruction: string) => void
  onAddThought: (idea: string) => void
}

const Main: React.FC<MainProps> = ({
  created,
  onCreate,
  onAddThought
}: MainProps) => {
  const [title, setTitle] = React.useState("")
  const [idea, setIdea] = React.useState("")
  const [instruction, setInstruction] = React.useState("")
  const onCreateClicked = () => {
    onCreate(title, instruction)
  }

  const onAddClicked = () => {
    onAddThought(idea)
  }

  return (
    <Container>
      <Box>
        <Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {!created ? (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter title"
                size="small"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <TextField
                fullWidth
                multiline
                variant="outlined"
                label="Enter instruction (optional)"
                size="small"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onCreateClicked}>
                Create
              </Button>
            </>
          ) : (
            <>
              <TextField
                fullWidth
                variant="outlined"
                label="Enter idea"
                size="small"
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
              />
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={onAddClicked}>
                Add
              </Button>
            </>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default Main
