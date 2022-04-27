import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.isHighlight ? 'square highlight' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            onClick={() => this.props.onClick(i)}
            key={i}
            isHighlight={this.props.line ? this.props.line.includes(i) : false}
        />;
    }

    render() {
        const rows = [];
        for (let i = 0; i < 3; i++) {
            const cols = [];
            for (let j = 0; j < 3; j++) {
                cols.push(this.renderSquare(i * 3 + j))
            }
            rows.push(<div className="board-row" key={i}>{cols}</div>)
        }
        return (<div>{rows}</div>);
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                col: null,
                row: null,
            }],
            stepNumber: 0,
            xIsNext: true,
            isReversed: false,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const [winner,] = calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares,
                col: i % 3 + 1,
                row: Math.floor(i / 3) + 1,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    reverseHistory() {
        this.setState({
            isReversed: !this.state.isReversed,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, line] = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const col = history[move].col;
            const row = history[move].row;
            const desc = move ?
                // 'Go to move #' + move:
                'Go to move #' + move + '(' + col + ',' + row + ')' :
                'Go to game start';
            const styles = {
                fontWeight: move === this.state.stepNumber && 'bold',
            }
            return (
                <li key={move}>
                    <button
                        style={styles}
                        onClick={() => this.jumpTo(move)}>
                        {desc}
                    </button>
                </li>
            )
        })

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if (!current.squares.includes(null)) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) => this.handleClick(i)}
                        line={line}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => this.reverseHistory()}>toggle</button>
                    <ol>{this.state.isReversed ? moves.reverse() : moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], lines[i]];
        }
    }
    return [null, null];
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
