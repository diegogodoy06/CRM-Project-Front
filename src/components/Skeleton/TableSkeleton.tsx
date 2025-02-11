import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TableSkeleton = () => {
  return (
    <div style={{ padding: "20px", maxWidth: "400px", margin: "auto" }}>
      <Skeleton height={50} width={"100%"} style={{ marginBottom: "10px" }} /> {/* Nome */}
      <Skeleton height={20} width={"80%"} style={{ marginBottom: "10px" }} /> {/* Email */}
      <Skeleton height={20} width={"60%"} style={{ marginBottom: "10px" }} /> {/* Telefone */}
      <Skeleton height={40} width={"100%"} style={{ marginBottom: "10px" }} /> {/* Botão */}
    </div>
  );
};

export default TableSkeleton;
