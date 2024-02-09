import styles from "../page.module.css";

const Form = ({token, onChange, onClick, val, loading}) => {
  return (
    <main className={styles.main}>
      <div className={styles.box}>
        <input
          type="number"
          className={styles.input1}
          placeholder="0 RBNT"
          value={token.RBNT}
          onChange={onChange}
        />
        <div className={styles.buttondiv}>
          <input
            type="number"
            className={styles.input2}
            placeholder="0 SHUBH"
            value={token.SHUBH}
            readOnly
          />
          <div>
            <button className={styles.button} onClick={token.RBNT && onClick}>
            {!loading && val}
            {loading && <p className={styles.spinner}></p>}
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Form