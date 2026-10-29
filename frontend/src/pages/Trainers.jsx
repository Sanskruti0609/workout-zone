import Section from "../components/common/Section.jsx";
import TrainerCard from "../components/trainers/TrainerCard.jsx";
import { Async } from "../components/common/Status.jsx";
import { useFetch } from "../hooks/useFetch.js";

function Group({ title, list }) {
  if (list.length === 0) return null;
  return (
    <>
      <h3 className="group-title">{title}</h3>
      <div className="t-grid">{list.map((t) => <TrainerCard key={t.id} trainer={t} />)}</div>
    </>
  );
}

export default function Trainers() {
  const state = useFetch("/api/trainers");
  return (
    <Section eyebrow="Meet the team" title="Our trainers.">
      <Async state={state} empty="Trainer profiles will appear here soon.">
        {(list) => (
          <>
            <Group title="Main trainer" list={list.filter((t) => t.isMainTrainer)} />
            <Group title="Male trainers" list={list.filter((t) => t.gender === "MALE" && !t.isMainTrainer)} />
            <Group title="Female trainers" list={list.filter((t) => t.gender === "FEMALE" && !t.isMainTrainer)} />
          </>
        )}
      </Async>
    </Section>
  );
}
