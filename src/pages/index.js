import { sendFile } from "@/requests"
import { CloudUpload, FolderZip } from "@mui/icons-material"
import { Box, Button, Chip, styled } from "@mui/material"
import { useState } from "react"

export const FileNames = ({ fileData }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      {
        fileData.map((f, i) => {
          return <Chip sx={{ m: 1 }} color="primary" label={f.name} key={i} icon={<FolderZip />} />
        })
      }
    </Box>
  )
}

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
})

const DropZone = () => {
  const [files, setFiles] = useState([])
  const handleUpload = async () => {
    const formData = new FormData()
    files.forEach(f => formData.append('files', f))
    sendFile(formData, 'uploadc')
  }
  const handleChange = e => {
    e.preventDefault()
    e.stopPropagation()
    const filess = e.target.files
    if (filess && filess.length > 0) {
      setFiles([...filess])
    }
  }
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      <Button component="label" sx={{ m: 1 }} startIcon={<CloudUpload />}>
        Subir archivo
        <VisuallyHiddenInput type="file" onChange={handleChange} />
      </Button>
      <FileNames fileData={files}></FileNames>
      <Button onClick={handleUpload}>intentar</Button>
    </Box >
  )
}

export default DropZone