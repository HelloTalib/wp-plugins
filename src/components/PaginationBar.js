import React from "react";
import { Box, Button, Paper, Pagination, TextField, Typography } from "@mui/material";

function PaginationBar({
  currentPage,
  totalPages,
  totalPlugins,
  perPage,
  jumpPage,
  setJumpPage,
  onPageChange,
}) {
  const startItem = totalPlugins === 0 ? 0 : (currentPage - 1) * perPage + 1;
  const endItem = Math.min(currentPage * perPage, totalPlugins);

  return (
    <Paper
      elevation={0}
      sx={{
        mt: 4,
        p: { xs: 2.5, md: 3 },
        borderRadius: 4,
        border: "1px solid rgba(148, 163, 184, 0.06)",
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
        bgcolor: "rgba(26, 26, 46, 0.85)",
        backdropFilter: "blur(20px)",
        display: "grid",
        gap: 2.5,
        animation: "fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both",
      }}
    >
      <Box sx={{ textAlign: "center" }}>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 500,
            color: "text.secondary",
            fontFeatureSettings: '"tnum"',
            fontSize: "0.84rem",
          }}
        >
          Showing{" "}
          <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
            {startItem.toLocaleString()}
          </Box>
          {" – "}
          <Box component="span" sx={{ color: "#fff", fontWeight: 700 }}>
            {endItem.toLocaleString()}
          </Box>
          {" of "}
          <Box component="span" sx={{ color: "primary.light", fontWeight: 700 }}>
            {totalPlugins.toLocaleString()}
          </Box>
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          overflowX: "auto",
          pb: 0.5,
          "&::-webkit-scrollbar": { height: 3 },
          "&::-webkit-scrollbar-thumb": { borderRadius: 99, bgcolor: "rgba(99,102,241,0.3)" },
        }}
      >
        <Pagination
          color="primary"
          count={totalPages}
          page={currentPage}
          onChange={(event, value) => onPageChange(value)}
          siblingCount={1}
          boundaryCount={1}
          size="medium"
          showFirstButton
          showLastButton
          sx={{
            "& .MuiPaginationItem-root": {
              fontWeight: 700,
              borderRadius: 2,
              minWidth: 36,
              height: 36,
              color: "text.secondary",
              transition: "all 0.3s ease",
              "&:hover": {
                bgcolor: "rgba(99, 102, 241, 0.12)",
                color: "primary.light",
              },
            },
            "& .MuiPaginationItem-root.Mui-selected": {
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 4px 16px rgba(99, 102, 241, 0.35)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
              },
            },
          }}
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: 1,
          pt: 1.5,
          borderTop: "1px solid rgba(148, 163, 184, 0.06)",
        }}
      >
        <Typography
          variant="caption"
          sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}
        >
          Jump to page
        </Typography>
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            const pageNum = parseInt(jumpPage, 10);
            if (!Number.isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
              onPageChange(pageNum);
              setJumpPage("");
            }
          }}
          sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
        >
          <TextField
            size="small"
            type="number"
            value={jumpPage}
            onChange={(e) => setJumpPage(e.target.value)}
            placeholder={`1–${totalPages}`}
            inputProps={{ min: 1, max: totalPages }}
            sx={{ width: 100, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
          />
          <Button
            type="submit"
            variant="contained"
            size="small"
            disabled={!jumpPage}
            sx={{ borderRadius: 2, minHeight: 36 }}
          >
            Go
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default PaginationBar;
