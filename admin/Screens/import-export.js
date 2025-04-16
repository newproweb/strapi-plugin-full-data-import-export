import React, { useEffect, useState } from "react";
import { useIntl } from "react-intl";
import { File } from "@strapi/icons";

import pluginId from "../pluginId";
import FileImg from "../Assets/file.svg";
import FileUpload from "../Assets/file-upload.svg";
import ColoredTrash from "../Assets/ColoredTrash";
import ColoredDownload from "../Assets/ColoredDownload";
import { useDropzone } from "react-dropzone";

import {
  BaseHeaderLayout,
  Box,
  ContentLayout,
  Button,
  Flex,
  Grid,
  Typography,
  GridItem,
  Loader,
} from "@strapi/design-system";
import {
  deleteData,
  downloadData,
  generateData,
  getMetadata,
  uploadData,
} from "../Utils/data-api";

const ImportExportScreen = () => {
  const { formatMessage, formatDate } = useIntl();
  const [metadata, setMetadata] = useState();
  const [file, setFile] = useState();

  const updateMetadata = async () => {
    getMetadata().then((res) => setMetadata(res));
  };

  const onDrop = (acceptedFiles) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    accept: ".tar.gz",
    disabled: metadata?.name === "Generating",
  });

  useEffect(() => {
    updateMetadata();
  }, []);

  const handleGenerate = () => {
    generateData()
      .then(() => {
        setMetadata({
          name: "Generating",
          size: 0,
          updatedAt: new Date(),
        });
      })
      .then(() => {
        const metadataInterval = setInterval(() => {
          getMetadata().then((meta) => {
            if (meta?.name !== "Generating") {
              clearInterval(metadataInterval);
              setMetadata(meta);
            }
          });
        }, 1000);
      });
  };

  const handleDelete = () => {
    deleteData().then(() => {
      updateMetadata();
    });
  };

  const handleDownload = () => {
    downloadData().then((response) => {
      const disposition = response.headers["content-disposition"];
      let filename = "data-seed.tar.gz";

      if (disposition && disposition.includes("filename=")) {
        const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(
          disposition
        );
        if (matches != null && matches[1]) {
          filename = matches[1].replace(/['"]/g, "");
        }
      }

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!file) return;

    setMetadata({
      name: "Generating",
      size: 0,
      updatedAt: file.lastModified,
    });

    const formData = new FormData();
    formData.append("data-file", file);

    uploadData(formData).then(() => {
      const metadataInterval = setInterval(() => {
        getMetadata().then((meta) => {
          if (meta?.name !== "Generating") {
            clearInterval(metadataInterval);
            setMetadata(meta);
          }
        });
      }, 1000);
    });
  };

  return (
    <Box>
      <BaseHeaderLayout
        p={0}
        as="h2"
        title={formatMessage({
          id: `${pluginId}-overview.header.title`,
          defaultMessage: "Full Data Import Export",
        })}
      />
      <ContentLayout>
        <Box
          background="neutral0"
          hasRadius
          shadow="filterShadow"
          paddingTop={6}
          paddingBottom={6}
          paddingLeft={7}
          paddingRight={7}
        >
          <Flex direction="column" alignItems="stretch" gap={4}>
            <Flex direction="column" alignItems="stretch" gap={1}>
              <Grid gap={3}>
                <GridItem col={3}>
                  <Box
                    padding={4}
                    background="neutral200"
                    borderColor="neutral300"
                    shadow="filterShadow"
                    style={{
                      minHeight: "250px",
                      alignContent: "center",
                      borderRadius: "12px",
                    }}
                    position="relative"
                    textAlign="center"
                  >
                    {!metadata && <Loader />}
                    {!metadata?.name && (
                      <Typography
                        variant="alpha"
                        textColor="secondary600"
                        fontWeight={600}
                      >
                        {formatMessage({
                          id: `${pluginId}-overview.file.not-found`,
                          defaultMessage: "Data file is not generated",
                        })}
                      </Typography>
                    )}
                    {!!metadata?.name && (
                      <>
                        <img style={{ maxWidth: "125px" }} src={FileImg} />
                        <Typography textColor="secondary600" as="h3">
                          {metadata.name === "Generating"
                            ? "Generating"
                            : `${metadata.name} ${metadata.size}`}
                        </Typography>
                        <Typography textColor="alternative600" as="h5">
                          {formatMessage(
                            {
                              id: `${pluginId}-overview.file.updated_at`,
                              defaultMessage: "Updated at {updatedAt}",
                            },
                            {
                              updatedAt: formatDate(metadata.updated_at, {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }),
                            }
                          )}
                        </Typography>
                        {metadata.name === "Generating" && (
                          <Loader small={true} />
                        )}
                      </>
                    )}
                    <Flex marginTop={2} gap={2} justifyContent="center">
                      <Button
                        disabled={metadata?.name === "Generating"}
                        startIcon={<File />}
                        onClick={handleGenerate}
                      >
                        {formatMessage({
                          id: `${pluginId}-overview.file.generate-new`,
                          defaultMessage: "Generate new",
                        })}
                      </Button>
                      <Button
                        disabled={
                          !metadata?.name || metadata?.name === "Generating"
                        }
                        startIcon={
                          <ColoredDownload style={{ color: "white" }} />
                        }
                        onClick={handleDownload}
                        variant="success"
                      >
                        {metadata?.size}
                      </Button>
                      <Button
                        disabled={
                          !metadata?.name || metadata?.name === "Generating"
                        }
                        startIcon={<ColoredTrash style={{ color: "white" }} />}
                        onClick={handleDelete}
                        variant="danger"
                      >
                        {formatMessage({
                          id: `${pluginId}-overview.file.delete`,
                          defaultMessage: "Delete",
                        })}
                      </Button>
                    </Flex>
                  </Box>
                </GridItem>
                <GridItem col={3}>
                  <Box
                    padding={4}
                    background="neutral200"
                    borderColor="neutral300"
                    shadow="filterShadow"
                    style={{
                      minHeight: "250px",
                      alignContent: "center",
                      borderRadius: "12px",
                      borderStyle: "dashed",
                      borderWidth: "3px",
                      cursor: "pointer",
                    }}
                    position="relative"
                    textAlign="center"
                    {...getRootProps()}
                  >
                    <input {...getInputProps()} />
                    <Typography as="h3" textColor="secondary600">
                      {formatMessage({
                        id: `${pluginId}-overview.file.upload`,
                        defaultMessage: "Upload data file",
                      })}
                    </Typography>
                    <img
                      style={{
                        maxWidth: "125px",
                        filter: !!file ? "grayscale(0)" : "grayscale(1)",
                      }}
                      src={FileUpload}
                    />
                    {!file && (
                      <Typography as="h4" textColor="alternative600">
                        {formatMessage({
                          id: `${pluginId}-overview.file.drop-or-select`,
                          defaultMessage: "Drag or select data file",
                        })}
                      </Typography>
                    )}
                    {!!file && (
                      <Box textAlign="center">
                        <Typography as="h4" textColor="alternative600">
                          {file.name}
                          <br />
                          {formatMessage(
                            {
                              id: `${pluginId}-overview.file.updated_at`,
                              defaultMessage: "Updated at {updatedAt}",
                            },
                            {
                              updatedAt: formatDate(file.lastModified, {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: false,
                              }),
                            }
                          )}
                        </Typography>
                        <Button
                          style={{ display: "inline-flex", marginTop: ".5rem" }}
                          onClick={handleUpload}
                          disabled={metadata?.name === "Generating"}
                        >
                          {formatMessage({
                            id: `${pluginId}-overview.file.import`,
                            defaultMessage: "Import data",
                          })}
                        </Button>
                      </Box>
                    )}
                  </Box>
                </GridItem>
              </Grid>
            </Flex>
          </Flex>
        </Box>
      </ContentLayout>
    </Box>
  );
};

export default ImportExportScreen;
