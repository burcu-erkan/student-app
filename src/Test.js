const Test = ({ students }) => {
  return students.grades.map((num, i) => {
    return (
      <ul>
        <li>
          Test{i + 1}: {num}%
        </li>
      </ul>
    );
  });
};
export default Test;
