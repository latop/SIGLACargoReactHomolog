interface Params {
  title: string;
  value: string | number;
}

const CardIndicator = ({ title, value }: Params) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h2> {title}</h2>
      <h3>{value}</h3>
    </div>
  );
};

export default CardIndicator;
