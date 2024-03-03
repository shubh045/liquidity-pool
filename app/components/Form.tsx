import React from "react";
import styles from "../page.module.css";

interface Tokens {
  RBNT: string;
  SHUBH: string;
}

interface FormProps {
  token: Tokens;
  onChange(e: React.ChangeEvent<HTMLInputElement>): Promise<void>;
  onClick(): Promise<void>;
  val: string;
  loading: boolean;
}

const Form = ({ token, onChange, onClick, val, loading }: FormProps) => {
  console.log(token)
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
            <button
              className={styles.button}
              onClick={token.RBNT ? onClick : undefined}
              disabled={loading}
            >
              {!loading && val}
              {loading && <p className={styles.spinner}></p>}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Form;
