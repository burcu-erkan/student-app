import { useEffect, useState } from "react";
import "./styles.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [value, setValue] = useState("");
  const [searchTags, setSearchTags] = useState("");
  const [tagValue, setTagValue] = useState({});
  const [show, setShow] = useState({});

  // console.log(students);
  useEffect(() => {
    const fetchingData = async () => {
      const getData = await fetch(
        "https://api.hatchways.io/assessment/students"
      );
      const item = await getData.json();
      setStudents(item.students);
    };
    fetchingData();
  }, []);

  let filterStudents = students.filter((val) => {
    if (value === "" && searchTags === "") {
      return val;
    } else if (
      val.firstName.toLowerCase().includes(value.toLowerCase()) ||
      val.lastName.toLowerCase().includes(value.toLowerCase())
    ) {
      return val;
    }
  });

  const onClicked = (id) => {
    const showObject = students.reduce((a, b) => {
      a[b.id] = false;
      return a;
    }, {});
    setShow(showObject);
    setShow({ ...show, [id]: !show[id] });
  };

  const onChanged = (e) => {
    setTagValue({ name: e.target.value, id: e.target.id });
  };

  const handleEnter = (e, id) => {
    e.preventDefault();
    if (tagValue.name) {
      let student = students.find((student) => student.id === tagValue.id);
      if (student.hasOwnProperty("tags")) {
        student.tags = [...student.tags, tagValue.name];
      } else {
        student.tags = [tagValue.name];
      }
      setTagValue({ name: "", id: id });
    }

    console.log(tagValue, "tagvalue");
  };

  return (
    <div className="App">
      <input
        value={value}
        type="text"
        placeholder="Search by name"
        onChange={(e) => setValue(e.target.value)}
      />
      <input
        type="text"
        value={searchTags}
        onChange={(e) => setSearchTags(e.target.value)}
        placeholder="Search by tag"
      />

      {filterStudents.map((student) => {
        return (
          <div>
            <div key={student.id} id={student.id} className="contain">
              <div className="image">
                <img src={student.pic} alt="" />
              </div>
              <div className="info">
                <h1>{`${student.firstName} ${student.lastName}`}</h1>

                <p>Email:{student.email}</p>
                <p>Company:{student.company}</p>
                <p>Skill:{student.skill}</p>
                <p>
                  Avarage:
                  {student.grades
                    .map((num) => Number(num))
                    .reduce((a, b) => a + b, 0) / 8}
                  %
                </p>

                {show[student.id]
                  ? student.grades.map((num, i) => {
                      return (
                        <ul>
                          <li>
                            Test{i + 1}: &emsp;&emsp;&emsp;{num}%
                          </li>
                        </ul>
                      );
                    })
                  : null}
                {student.hasOwnProperty("tags")
                  ? student.tags.map((tag) => {
                      return (
                        <div key={tag.id} className="tag">
                          {tag}
                        </div>
                      );
                    })
                  : null}

                <form onSubmit={handleEnter}>
                  <input
                    type="text"
                    value={tagValue.name}
                    id={student.id}
                    placeholder="Add a tag"
                    onChange={onChanged}
                  />
                </form>
              </div>

              <div className="button">
                <button
                  value={student.id}
                  onClick={() => onClicked(student.id)}
                >
                  {!show[student.id] ? "+" : "-"}
                </button>
              </div>
            </div>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

// city: "Fushë-Muhurr"
// company: "Yadel"
// email: "iorton0@imdb.com"
// firstName: "Ingaberg"
// grades: Array(8)
// id: "1"
// lastName: "Orton"
// pic: "https://storage.googleapis.com/hatchways-app.appspot.com/assessments/data/frontend/images/voluptasdictablanditiis.jpg"
// skill: "Oracle"
